import { Typography } from "@/components";

const delay = async (x: number) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), x);
  });
};

const Parent = () => {
  return (
    <main className={`min-h-screen`}>
      <Typography fullPage>Welcome</Typography>
    </main>
  );
};

export default Parent;
