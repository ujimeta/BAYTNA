type Props = {
  emoji: string;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
};

export default function UserTypeCard({
  emoji,
  title,
  description,
  selected,
  onClick,
}: Props) {
  return (
    <button
  onClick={onClick}
  className={`
    group
    h-full
    w-full
    rounded-3xl
    border
    p-7
    text-left
    transition-all
    duration-300

    ${
      selected
        ? "border-[#355E4B] bg-[#EEF5F1] shadow-2xl scale-[1.03]"
        : "border-gray-200 bg-white hover:-translate-y-2 hover:border-[#355E4B] hover:shadow-2xl"
    }
  `}
>
      <div
        className="
          mb-5
          text-5xl
          transition-transform
          duration-300
          group-hover:scale-110
        "
      >
        {emoji}
      </div>

      <h3
        className="
          text-xl
          font-semibold
          leading-tight
          text-gray-900
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-3
          text-[15px]
          leading-7
          text-gray-500
        "
      >
        {description}
      </p>

      <div
  className={`
    mt-6
    flex
    items-center
    text-[#355E4B]
    transition-all
    duration-300

    ${
      selected
        ? "opacity-100"
        : "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
    }
  `}
>
  {selected ? "✓ Selected" : "This is me →"}
</div>
    </button>
  );
}