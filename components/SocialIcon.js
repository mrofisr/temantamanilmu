import { FaInstagram } from "react-icons/fa";
const links = [
  {
    Icon: FaInstagram,
    href: "https://www.instagram.com/temantamanilmu",
    arialabel: "Instagram",
  },
];

export default function SocialIcon() {
  return (
    <div className="flex flex-row text-2xl my-6 text-gray-500 dark:text-gray-300">
      {links.map(({ Icon, href, arialabel }, i) => (
        <a
          key={href}
          href={href}
          target="_blank"
          aria-label={arialabel}
          rel="noopener noreferrer nofollow"
          className={`hover:text-gray-800 dark:hover:text-white transition-colors ${
            i < links.length - 1 ? "mr-3" : ""
          }`}
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}
