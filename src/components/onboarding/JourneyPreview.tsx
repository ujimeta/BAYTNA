type ExperienceCard = {
  icon: string;
  title: string;
  description: string;
};

type Props = {
  title: string;
  description: string;
  experienceCards: ExperienceCard[];
  buttonText: string;
  onContinue: () => void;
};

export default function JourneyPreview({
  title,
  description,
  experienceCards,
  buttonText,
  onContinue,
}: Props) {
  return (
    <section
      className="
        mt-16
        rounded-[32px]
        border
        border-[#DCE8E1]
        bg-gradient-to-br
        from-[#F8FBF9]
        to-white
        p-10
        shadow-xl
      "
    >
      {/* Header */}

      <div className="max-w-3xl">
        <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#6A8C7C]">
          Your BAYTNA Journey
        </p>

        <h2
          className="
            mt-3
            text-4xl
            font-serif
            font-semibold
            text-[#355E4B]
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-5
            text-lg
            leading-8
            text-gray-600
          "
        >
          {description}
        </p>
      </div>

      {/* Experience Cards */}

      <div
        className="
          mt-12
          grid
          gap-6
          md:grid-cols-2
        "
      >
        {experienceCards.map((card) => (
          <div
            key={card.title}
            className="
              group
              rounded-3xl
              border
              border-[#E6EFEA]
              bg-white
              p-7
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-2
              hover:shadow-xl
              hover:border-[#355E4B]
            "
          >
            <div className="text-5xl">
              {card.icon}
            </div>

            <h3
              className="
                mt-6
                text-xl
                font-semibold
                text-[#355E4B]
              "
            >
              {card.title}
            </h3>

            <p
              className="
                mt-3
                leading-7
                text-gray-600
              "
            >
              {card.description}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}

      <div
        className="
          mt-14
          rounded-3xl
          bg-[#355E4B]
          p-10
          text-center
          text-white
        "
      >
        <h3
          className="
            text-3xl
            font-serif
            font-semibold
          "
        >
          Ready to Begin?
        </h3>

        <p
          className="
            mt-4
            max-w-2xl
            mx-auto
            text-white/90
            leading-8
          "
        >
          Everything is prepared for your personalised BAYTNA experience.
          Let's take the next step together.
        </p>

        <button
          onClick={onContinue}
          className="
            mt-8
            rounded-full
            bg-white
            px-10
            py-4
            font-semibold
            text-[#355E4B]
            shadow-lg
            transition-all
            duration-300
            hover:scale-105
          "
        >
          {buttonText}
        </button>
      </div>
    </section>
  );
}