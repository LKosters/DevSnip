import { UserProfile } from "@clerk/nextjs";

export default function UserPage() {
  return (
    <div className="container mx-auto">
      <UserProfile 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-none"
          }
        }}
      />
    </div>
  );
}

