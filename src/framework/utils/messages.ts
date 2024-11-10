import fs from 'node:fs';
import yaml from 'js-yaml';

export let messages = getMessages();

setInterval(() => {
  console.log('a');
  messages = getMessages();
}, 60000);

function getMessages() {
  return yaml.load(fs.readFileSync('config/messages.yml', 'utf8')) as {
    [key: string]: { [key: string]: string[] };
  };
}

export function getRandomMessage(
  card: string,
  key: string,
  variables?: { [key: string]: string | number },
) {
  const choices = messages?.[card]?.[key];
  if (!choices?.length) {
    return `Error: Cannot find messages in the card \`${card}\` and key \`${key}\`.`;
  }
  return bracketParser(choices[Math.floor(Math.random() * choices.length)], variables ?? {});
}

function bracketParser(text: string, variables: { [key: string]: string | number }) {
  let result = '';
  let i = 0;

  while (i < text.length) {
    let matched = false;

    for (const [name, value] of Object.entries(variables)) {
      const placeholder = `{{${name}}}`;

      if (text.startsWith(placeholder, i)) {
        result += value;
        i += placeholder.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      result += text[i];
      i++;
    }
  }

  return result;
}
