import SocialIcon from "@/components/SocialIcon";

export default function Title({
  title,
  subtitle = "",
  center = false,
  icons = true,
}) {
  return (
    <div className="mt-14 lg:mt-32 font-light w-full text-black dark:text-white">
      <h1
        className={`text-3xl sm:text-4xl lg:text-5xl mb-2 ${
          center && "md:text-center"
        }`}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="text-xl sm:text-2xl lg:text-3xl w-11/12 sm:w-5/6 md:w-11/12 lg:w-4/5 xl:w-3/5">
          {subtitle}
        </p>
      )}
      {icons && <SocialIcon />}
    </div>
  );
}
