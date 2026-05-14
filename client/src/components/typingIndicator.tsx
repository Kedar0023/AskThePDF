import { IconFileText } from "@tabler/icons-react";

const TypingIndicator = () => {
	return (
		<div className="flex gap-3 justify-start">
			<div className="flex items-start">
				<div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
					<IconFileText className="h-3.5 w-3.5 text-primary-foreground" />
				</div>
			</div>
			<div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
				<span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
				<span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
				<span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
			</div>
		</div>
	);
};
export default TypingIndicator;
