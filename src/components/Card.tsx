type Props = {
	companyName: string
	positon: string
	status: string
	date: string
}
export default function Card({
	companyName,
	positon,
	status = "Pending",
	date,
}: Props) {
	return (
		<div className="max-w-xs rounded border p-4">
			<h2>{companyName}</h2>
			<h2 className="my-4">{positon}</h2>
			<h2 className="mb-4">{status}</h2>
			<h2>{date}</h2>
		</div>
	)
}
