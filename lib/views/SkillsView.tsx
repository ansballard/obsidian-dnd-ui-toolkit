import * as Tmpl from "lib/html-templates"
import { type SkillItem, SkillGrid } from "lib/components/skill-cards"
import { BaseView } from "./BaseView";
import type { MarkdownPostProcessorContext } from "obsidian";
import * as AbilityService from "lib/domains/abilities"
import * as SkillsService from "lib/domains/skills"
import type { AbilityBlock } from "lib/types";

export class SkillsView extends BaseView {
	public codeblock = "skills";

	public async render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
		const frontmatter = this.frontmatter(ctx)
		const abilityBlock = AbilityService.parseAbilityBlockFromFrontmatter(frontmatter, this.getSettings())
		const skillsBlock = SkillsService.parseSkillsBlock(source);

		const data: SkillItem[] = []

		for (const skill of SkillsService.Skills) {
			const isHalfProficient = skillsBlock.half_proficiencies.find((x) => {
				return x.toLowerCase() === skill.label.toLowerCase()
			}) !== undefined;

			const isProficient = skillsBlock.proficiencies.find((x) => {
				return x.toLowerCase() === skill.label.toLowerCase()
			}) !== undefined;

			const isExpert = skillsBlock.expertise.find((x) => {
				return x.toLowerCase() === skill.label.toLowerCase()
			}) !== undefined;


			const skillAbility = abilityBlock.abilities[skill.ability as keyof AbilityBlock["abilities"]];
			if (!skillAbility) {
				throw new Error(`Skill ${skill.ability} not found in Skills list`);
			}

			let skillCheckValue = AbilityService.calculateModifier(skillAbility)
			if (isExpert) {
				skillCheckValue += frontmatter.proficiencyBonus * 2;
			} else if (isProficient) {
				skillCheckValue += frontmatter.proficiencyBonus;
			} else if (isHalfProficient) {
				skillCheckValue += Math.floor(frontmatter.proficiencyBonus / 2);
			}

			for (const bonus of skillsBlock.bonuses) {
				if (bonus.target.toLowerCase() === skill.label.toLowerCase()) {
					skillCheckValue += bonus.value;
				}
			}

			const abbreviation = skill.ability.substring(0, 3).toUpperCase();

			data.push({
				label: skill.label,
				ability: abbreviation,
				modifier: skillCheckValue,
				isProficient: isProficient,
				isExpert: isExpert,
				isHalfProficient: isHalfProficient,
			})
		}

		return Tmpl.Render(SkillGrid({ items: data }))
	}
}

