import { Command } from "@httpi/client";
import { Glob } from "bun";

const glob = new Glob("*.ts");
const imports = await Promise.all(
	[...glob.scanSync("./src/commands")].map((f) => import(`../commands/${f}`)),
);

export default imports
	.map((i) => i.default)
	.filter((c) => c instanceof Command);
