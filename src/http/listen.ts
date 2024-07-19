import env from "../utils/env";
import commands from "../utils/commands";
import components from "../utils/components";
import { Hono } from "hono";
import { handleHonoRequest } from "@httpi/adapter-hono";
import { createEvents } from "@httpi/client";

const app = new Hono();

app.get("/", (c) => c.text(`👋 ${env.DiscordClientId}`));

app.post(
	"/",
	async (c) =>
		await handleHonoRequest({
			context: c,
			publicKey: env.DiscordPublicKey,
			events: createEvents({
				commands,
				components,
			}),
		}),
);

app.all("*", (c) => c.text("Not found", 404));

export default app;
