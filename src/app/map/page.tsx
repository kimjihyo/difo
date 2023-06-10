import { InteractiveMap } from '@/components/InteractiveMap';

export default function Page() {
  return (
    <div className="flex-1 flex">
      <div className="w-[380px] bg-blue-500" />
      <div className="flex-1">
        <InteractiveMap className="w-full h-full bg-[#111111]" />
      </div>
    </div>
  );
}
