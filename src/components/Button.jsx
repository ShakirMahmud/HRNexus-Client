import { Button } from "@material-tailwind/react";
import { div } from "framer-motion/client";
 
export function ButtonDefault() {
  return <div>
    <Button color="amber">color amber</Button>
    <Button className="rounded-full" loading={true}>
        Loading
      </Button>
  </div>;
}