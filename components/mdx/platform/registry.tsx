import type { MDXComponents } from 'mdx/types';
import { mdxAdmonitionComponents } from '@/components/mdx/platform/admonitions';
import { mdxCoreComponents } from '@/components/mdx/platform/core';
import { mdxDocsWidgetComponents } from '@/components/mdx/platform/docs-widgets';
import {
  mdxIconComponents,
  mdxLucideComponents,
} from '@/components/mdx/platform/icons';

export const mdxComponentRegistry: MDXComponents = {
  ...mdxLucideComponents,
  ...mdxIconComponents,
  ...mdxAdmonitionComponents,
  ...mdxDocsWidgetComponents,
  ...mdxCoreComponents,
};

export function useMDXComponents(
  components: MDXComponents = {},
): MDXComponents {
  return {
    ...mdxComponentRegistry,
    ...components,
  };
}

