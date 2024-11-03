import { Component } from '@httpi/client';
import { InteractionResponseType, MessageFlags } from 'discord-api-types/v10';
import { getCard, getPlayer, getWDCGame, WDCGameState } from '../framework';
import { createSelectCardMessage } from '../utils';

export default new Component({
  customId: /^g:select_cards:use:[0-3]$/,
  async execute({ user, interaction, respond }) {
    const channelId = interaction.channel?.id;
    if (!channelId) return;

    const game = getWDCGame(channelId);
    if (!game) {
      return respond({
        type: InteractionResponseType.UpdateMessage,
        data: {
          content: "❌ There aren't any ongoing games on this channel!",
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    const player = getPlayer(game, user.id);
    if (!player) {
      return respond({
        type: InteractionResponseType.UpdateMessage,
        data: {
          content: "❌ You aren't in this game!",
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    if (game.state !== WDCGameState.Started) {
      return respond({
        type: InteractionResponseType.UpdateMessage,
        data: {
          content: "❌ Cannot set cards in a game that hasn't started",
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    if (player.health <= 0) {
      return respond({
        type: InteractionResponseType.UpdateMessage,
        data: {
          content: '❌ You are dead!',
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    // Get the card index, and card ID
    const cardIndex = interaction.data?.custom_id.split(':')?.[3] ?? 0;
    const cardId = interaction.data?.values?.[0] ?? null;

    // Get card information
    const card = getCard(cardId);
    if (!card) {
      return respond({
        type: InteractionResponseType.UpdateMessage,
        data: {
          content: "❌ Card doesn't exist anymore",
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    // Check if user has the card
    const playerCard = player.cards.find((c) => c.cardId === cardId);
    if (!playerCard) {
      return respond({
        type: InteractionResponseType.UpdateMessage,
        data: {
          content: '❌ You do not have this card!',
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    // Check if user can use this card anymore
    if (!playerCard.quantity) {
      return createSelectCardMessage(player, respond, `❌ You ran out of **${card.name}**.`);
    }

    // Check how many times the user is trying to use a card this turn AND the turn cooldown
    const mockChosenCardIds = [...player.chosenCardIds];
    mockChosenCardIds[cardIndex] = cardId;

    let afterRoundQuantity = playerCard.quantity;
    let checkTurnCooldown = 0;

    for (const chosenCardId of mockChosenCardIds) {
      if (cardId !== chosenCardId) {
        if (checkTurnCooldown) checkTurnCooldown--;
        continue;
      }

      if (checkTurnCooldown) {
        return createSelectCardMessage(
          player,
          respond,
          `❌ This card has a turn cooldown of **${card.turnCooldown}**.`,
        );
      }

      if (afterRoundQuantity <= 0) {
        return createSelectCardMessage(
          player,
          respond,
          `❌ You can only use this card **${playerCard.quantity}** more times in total.`,
        );
      }

      checkTurnCooldown = card.turnCooldown;
      afterRoundQuantity--;
    }

    // Set the card
    player.chosenCardIds[cardIndex] = cardId;

    // Respond to interaction
    return createSelectCardMessage(player, respond);
  },
});
