import { BadgeItem, BadgesBlock } from "../types";

const BadgeLabel = ({ label }: Pick<BadgeItem, 'label'>) => label && <span className="badge-label">{label}</span>
export function Badge({ item }: { item: BadgeItem }) {
	return (
		<div className="badge-item">
			{!item.reverse && <BadgeLabel label={item.label} />}
			{item.value && <span className="badge-value">{item.value}</span>}
			{item.reverse && <BadgeLabel label={item.label} />}
		</div>
	);
}

export function BadgesRow({ data }: { data: BadgesBlock }) {
	const { items, dense } = data;

	return (
		<div className={`badges-row${dense ? ' dense' : ''}`}>
			{items.map(item => (
				<Badge item={item} key={item.label} />
			))}
		</div>
	)
}
