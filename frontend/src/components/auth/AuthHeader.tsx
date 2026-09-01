interface AuthHeaderProps {
    title: string;
    description: string;
}

export default function AuthHeader({
    title,
    description,
}: AuthHeaderProps) {
    return (<div className="mb-0.5 text-center sm:mb-1">
        <h1
            className="
                text-xl
                font-semibold
                tracking-tight
                text-white
                sm:text-2xl
                "
        >
            {title}
        </h1>

        <p
            className="
                mt-1
                text-xs
                leading-5
                text-white/45

                sm:mt-1
                sm:text-sm
                sm:leading-6
            "
        >
            {description}
        </p>
    </div>
    );


}
