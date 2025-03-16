export default function DashboardCard({title, subTitle, body}) {
    return (
        <div className="card">
            <div className="card-header">
                <p className="card-title">{title}</p>
            </div>
        </div>
    )
}