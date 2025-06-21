import * as Tmpl from "lib/html-templates"
import { BaseView } from "./BaseView";
import { StatsGridItems } from "../components/stat-cards";
import { MarkdownRenderer, type MarkdownPostProcessorContext } from "obsidian";
import type { StatItem, StatsBlock } from "lib/types";
import { parse } from 'yaml';

export class LinksView extends BaseView {
	public codeblock = "links";

	public async render(source: string, el: HTMLElement, _: MarkdownPostProcessorContext) {
		const parsed = parse(source);
		const items: Array<{path: string}> = Array.isArray(parsed.items) ? parsed.items : [];
		const grid = parsed.grid || {};

		const mappedLinks = await Promise.all(items.map(({path}) => {
			const tFile = this.app.vault.getFileByPath(path)
			if (!tFile) return null
			const content = await this.app.vault.cachedRead(tFile)
			return {
				path,
				content,
			}
		}))

		const statsBlock = {
			items: mappedLinks
				.filter(Boolean)
				.map(({path}) => MarkdownRenderer.render(this.app, content, el, path, this)),
			grid: {
				columns: typeof grid.columns === 'number' ? grid.columns : undefined
			}
		};

		console.log('stats', statsBlock)

		return null
	}
}
