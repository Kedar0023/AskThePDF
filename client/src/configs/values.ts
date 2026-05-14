import { IconAlertTriangle, IconFileSpark, IconGauge } from "@tabler/icons-react";

const PROMPTS = [
	{
		icon: IconFileSpark,
		text: "Write documentation",
		prompt:
			"Write comprehensive documentation for this codebase, including setup instructions, API references, and usage examples.",
	},
	{
		icon: IconGauge,
		text: "Optimize performance",
		prompt:
			"Analyze the codebase for performance bottlenecks and suggest optimizations to improve loading times and runtime efficiency.",
	},
	{
		icon: IconAlertTriangle,
		text: "Find and fix 3 bugs",
		prompt:
			"Scan through the codebase to identify and fix 3 critical bugs, providing detailed explanations for each fix.",
	},
];

const MODELS = [
	{
		value: "gpt-5",
		name: "GPT-5",
		description: "Most advanced model",
		max: true,
	},
	{
		value: "gpt-4o",
		name: "GPT-4o",
		description: "Fast and capable",
	},
	{
		value: "gpt-4",
		name: "GPT-4",
		description: "Reliable and accurate",
	},
	{
		value: "claude-3.5",
		name: "Claude 3.5 Sonnet",
		description: "Great for coding tasks",
	},
];

export { PROMPTS, MODELS };
