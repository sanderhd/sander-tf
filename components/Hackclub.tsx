export default function HackclubBanner() {
    return (
        <a 
            href="https://flavortown.hack.club/?ref=sanderhd"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed top-0 left-0 z-40 transition-transform hove:scale-105 origin-top-left"
            aria-label="Hack Club"
        >
            <img
                src="/flag-orpheus-left.svg"
                alt="Hack Club"
                width={220}
                height={124}
            />
        </a>
    )
}