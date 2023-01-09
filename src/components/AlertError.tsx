import { Alert } from "@mantine/core";

export function AlertError({ message }: { message: string }) {
  return (
    <Alert icon={<IconAlertCircle />} title="Error!" color="red">
      {message}
    </Alert>
  );
}

function IconAlertCircle() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      style={{ height: "1rem", width: "1rem" }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
      />
    </svg>
  );
}
