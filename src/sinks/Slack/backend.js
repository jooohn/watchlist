import { IncomingWebhook } from '@slack/client';
import config from '../../config';
import { embed } from '../../helpers/TemplateHelper';

const webhook = new IncomingWebhook(config.sink.slack.webhook);
const isNonEmptyString = str => str && str.length > 0;

const run = async ({ entry, before, after, params }) => {
  const text = embed(params.text)({ entry, before, after });
  const channel = isNonEmptyString(params.channel)
    ? params.channel
    : '#general';
  const iconEmojiPayload = isNonEmptyString(params.iconEmoji)
    ? { icon_emoji: params.iconEmoji }
    : {};
  const payload = {
    text,
    channel,
    ...iconEmojiPayload,
  };
  return await webhook.send(payload);
};

export default { run };
