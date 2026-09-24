
type GraphProps = {
  name:string;
  percent: number;
};


export function Graph({name, percent}:GraphProps) {
  return (
    <div className="w-full">
      <div className="mb-2 flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
        <span>{name}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-3 rounded-full bg-indigo-600 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}