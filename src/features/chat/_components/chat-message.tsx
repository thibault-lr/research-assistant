import { UIMessage } from "ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { normalizeMessage } from "../_helpers/message";
import ReactMarkdown from "react-markdown"; // <--- Import

interface ChatMessageProps {
  message: UIMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { role, content } = normalizeMessage(message);
  

  return (
    <Card
      className={
        role === "user"
          ? "ml-auto max-w-[80%] bg-slate-100 dark:bg-slate-800 gap-2"
          : "mr-auto max-w-[80%] gap-2"
      }
    >
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-semibold">
          {role === "user" ? "You" : "Assistant"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          
          {/* Si c'est l'utilisateur, on affiche le texte brut. 
              Si c'est l'assistant, on rend le Markdown. */}
          
          {role === "user" ? (
            content
          ) : (
            <ReactMarkdown
              components={{
                // Style pour les listes à puces (points)
                ul: ({ node, ...props }) => (
                  <ul className="list-disc pl-4 my-2 space-y-1" {...props} />
                ),
                // Style pour les listes numérotées (1., 2.)
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal pl-4 my-2 space-y-1" {...props} />
                ),
                // Style pour les éléments de liste
                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                // Style pour le texte en gras (**text**)
                strong: ({ node, ...props }) => (
                  <span className="font-bold text-slate-900 dark:text-slate-100" {...props} />
                ),
                // Style pour les liens (URLs)
                a: ({ node, ...props }) => (
                  <a 
                    className="text-blue-600 hover:underline cursor-pointer" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    {...props} 
                  />
                ),
                // Gérer les sauts de ligne
                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          )}
          
        </div>
      </CardContent>
    </Card>
  );
}