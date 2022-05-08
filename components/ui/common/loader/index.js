

const SIZES = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12"
}

export default function Loader({size = "md"}) {

    return (
        <div className={`sk-chase ${SIZES[size]}`}>
            {Array.from({length: 6}).map((_,i)=>
                <div key={`dot-${i}`} 
                className="sk-chase-dot"></div>
            )}
        </div>
    )
}