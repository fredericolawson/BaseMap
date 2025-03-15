interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-600">
      <p>{message}</p>
    </div>
  );
} 