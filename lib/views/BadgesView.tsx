import * as Tmpl from "lib/html-templates"
import { BaseView } from "./BaseView";
import { BadgesRow } from "../components/badges";
import type { MarkdownPostProcessorContext } from "obsidian";
import type { BadgeItem, BadgesBlock } from "lib/types";
import { parse } from 'yaml';
import { render } from 'ejs'

export class BadgesView extends BaseView {
	public codeblock = "badges";

	public async render(rawSource: string, _el: HTMLElement, ctx: MarkdownPostProcessorContext) {
		const source = render(rawSource, {frontmatter: this.frontmatter(ctx)})

		const parsed = parse(source);
		const items: Array<Partial<BadgeItem>> = Array.isArray(parsed.items) ? parsed.items : [];

		const badgesBlock: BadgesBlock = {
			items: items
				.filter(item => !!item.label)
				.map((item: Partial<BadgeItem>) => ({
						reverse: Boolean(item.reverse),
						label: String(item.label),
						value: String(item.value || ''),
				})),
			dense: Boolean(parsed.dense)
		};

		return Tmpl.Render(BadgesRow({ data: badgesBlock }));
	}
}
