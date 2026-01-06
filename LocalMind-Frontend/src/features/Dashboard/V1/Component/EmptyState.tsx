type EmptyStateProps = {
  title?: string
  description?: string
}

const EmptyState = ({
  title = 'No data available',
  description = 'Please check back later.',
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center text-gray-300">
      <p className="text-2xl mb-2">📭</p>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm mt-1">{description}</p>
    </div>
  )
}

export default EmptyState
