"use client";

import Link from "next/link";
import { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Partial<Components> = {
  h1: ({ children, ...props }) => (
    <h1 className="text-3xl font-semibold mt-6 mb-2 text-white" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-2xl font-semibold mt-6 mb-2 text-white" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-xl font-semibold mt-6 mb-2 text-white" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="text-lg font-semibold mt-6 mb-2 text-white" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5 className="text-base font-semibold mt-6 mb-2 text-white" {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6 className="text-sm font-semibold mt-6 mb-2 text-white" {...props}>
      {children}
    </h6>
  ),
  p: ({ children, ...props }) => (
    <p className="mb-4 leading-relaxed text-base text-zinc-200" {...props}>
      {children}
    </p>
  ),
  ol: ({ children, ...props }) => (
    <ol
      className="list-decimal list-outside ml-4 mb-4 text-zinc-200"
      {...props}
    >
      {children}
    </ol>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc list-outside ml-4 mb-4 text-zinc-200" {...props}>
      {children}
    </ul>
  ),
  li: ({ children, ...props }) => (
    <li className="py-1 text-zinc-200" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-4 border-muted-foreground pl-4 italic text-muted-foreground my-4"
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ className, children, ...props }) => {
    if (className) {
      return (
        <div className="not-prose flex flex-col my-4">
          <pre className="text-sm w-full overflow-x-auto bg-zinc-100 dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-50 whitespace-pre-wrap break-words font-mono">
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </div>
      );
    }

    return (
      <code
        className="text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md text-muted-foreground"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => <>{children}</>,
  strong: ({ children, ...props }) => (
    <span className="font-semibold text-white" {...props}>
      {children}
    </span>
  ),
  em: ({ children, ...props }) => (
    <em className="italic text-foreground" {...props}>
      {children}
    </em>
  ),
  a: ({ children, ...props }) => (
    // @ts-expect-error External Link props for Next.js Link
    <Link
      className="text-blue-500 hover:underline break-words"
      target="_blank"
      rel="noreferrer"
      {...props}
    >
      {children}
    </Link>
  ),
  hr: (props) => (
    <hr className="my-6 border-t border-muted-foreground" {...props} />
  ),
  table: ({ children, ...props }) => (
    <div className="relative overflow-x-auto my-4">
      <table
        className="w-full text-sm text-left text-zinc-200 rounded-lg"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead
      className="text-xs uppercase text-zinc-400 border-b border-zinc-700"
      {...props}
    >
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => <tbody {...props}>{children}</tbody>,
  tr: ({ children, ...props }) => (
    <tr
      className="border-b border-zinc-700 hover:bg-zinc-800 transition-colors"
      {...props}
    >
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th
      scope="col"
      className="px-6 py-3 font-semibold text-white whitespace-nowrap border-0"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td
      className="px-6 py-4 text-zinc-100 whitespace-nowrap border-0"
      {...props}
    >
      {children}
    </td>
  ),
};

const remarkPlugins = [remarkGfm];

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
      {children}
    </ReactMarkdown>
  );
};

const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

export default Markdown;
