"use client"

import { useSupabase } from "@/lib/supabase-provider"
import { Job } from "@/types/job"
import { format } from "date-fns"
import { Building2, Calendar, CodeIcon, Link } from "lucide-react"
import { useEffect, useState } from "react"
import EditDialog from "./EditDialog"

type Props = {
	job: Job
}

export default function VeiwCardMobile(props: Props) {
	const { supabase } = useSupabase()
	const [job, setJob] = useState(props.job)
	const { companyName, position, status, link, submitedDate, id } = job

	useEffect(() => {
		const channel = supabase
			.channel("custom-all-channel")
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "job",
					filter: `id=eq.${id}`,
				},
				(payload) => {
					setJob(payload.new as Job)
				}
			)
			.subscribe()

		return () => {
			channel.unsubscribe()
		}
	}, [supabase, id])

	return (
		<div className="rounded border p-3">
			<header className="">
				<div className="flex gap-2">
					<div className="flex gap-2">
						<Building2 className="aspect-square w-3" />
						<p>{companyName}</p>
					</div>
					<p
						className={`ml-auto rounded-full px-3 ${
							status === "pending"
								? "bg-amber-400"
								: status === "accepted"
								? "bg-green-400"
								: "bg-red-500 text-white"
						}`}>
						{status}
					</p>
				</div>
				<div className="my-2 flex justify-between">
					<div className="flex gap-2">
						<CodeIcon className="aspect-square w-3" />
						<h3>{position}</h3>
					</div>
					<a
						className="flex"
						href={link ?? ""}
						target="_blank">
						Link <Link className="ml-2 aspect-square w-3" />
					</a>
				</div>
				<p className="flex items-center justify-between">
					<span className="flex gap-2">
						<Calendar className="aspect-square w-3" />
						{format(new Date(submitedDate!), "PPP")}
					</span>
					<EditDialog
						companyName={companyName}
						position={position}
						status={status}
						submitedDate={new Date(submitedDate)}
						link={link}
						id={id}
					/>
				</p>
			</header>
		</div>
	)
}
