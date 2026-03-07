import { visit } from "unist-util-visit"

const DIRECTIVE_COMPONENT_MAP: Record<string, string> = {
  note: "Note",
  tip: "Tip",
  important: "Important",
  warning: "Warning",
  caution: "Caution",
  danger: "Danger",
  info: "Info",
  success: "Success",
  deprecated: "Deprecated",
  bug: "Bug",
  example: "Example",
  announcement: "Announcement",
  tabs: "Tabs",
  tab: "Tab",
}

function extractTitle(node: any) {
  if (node.label) return node.label
  if (node.attributes?.title) return node.attributes.title
  if (node.attributes?.label) return node.attributes.label
  return null
}

function hasFlag(node: any, flag: string) {
  const attrs = node.attributes ?? {}
  return attrs[flag] === "" || attrs[flag] === true || attrs[flag] === "true"
}

export default function remarkAdmonitionDirectives() {
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (
        node.type !== "containerDirective" &&
        node.type !== "leafDirective" &&
        node.type !== "textDirective"
      ) {
        return
      }

      const componentName = DIRECTIVE_COMPONENT_MAP[node.name]
      if (!componentName) return

      const title = extractTitle(node)
      const attributes: any[] = []

      if (title) {
        attributes.push({
          type: "mdxJsxAttribute",
          name: "title",
          value: title,
        })
      }

      if (node.attributes?.id) {
        attributes.push({
          type: "mdxJsxAttribute",
          name: "id",
          value: node.attributes.id,
        })
      }

      if (node.attributes?.class) {
        attributes.push({
          type: "mdxJsxAttribute",
          name: "className",
          value: node.attributes.class,
        })
      }

      if (componentName !== "Tabs" && componentName !== "Tab") {
        if (hasFlag(node, "collapsible")) {
          attributes.push({
            type: "mdxJsxAttribute",
            name: "collapsible",
            value: true,
          })
        }

        if (node.attributes?.defaultOpen === "false" || node.attributes?.open === "false") {
          attributes.push({
            type: "mdxJsxAttribute",
            name: "defaultOpen",
            value: false,
          })
        }
      }

      if (componentName === "Tab" && title) {
        attributes.push({
          type: "mdxJsxAttribute",
          name: "label",
          value: title,
        })
      }

      node.type = "mdxJsxFlowElement"
      node.name = componentName
      node.attributes = attributes
    })
  }
}
