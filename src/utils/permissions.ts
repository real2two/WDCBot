import { PermissionFlagsBits } from 'discord-api-types/v10';

export function hasManageGuild(permissions: string | bigint | undefined) {
  if (!permissions) return false;

  const permissionsBigInt = BigInt(permissions);
  return (
    (permissionsBigInt & PermissionFlagsBits.Administrator) === PermissionFlagsBits.Administrator ||
    (permissionsBigInt & PermissionFlagsBits.ManageGuild) === PermissionFlagsBits.ManageGuild
  );
}
