import {Command} from "commander"

const arg = new Command()

arg.option("--mode <mode>","to specify mode","dev")
arg.parse()

export default arg.opts()