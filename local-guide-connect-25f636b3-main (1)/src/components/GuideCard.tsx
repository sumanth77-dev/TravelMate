import { Guide } from "@/types/guide";
import { Star, MapPin, Globe } from "lucide-react";
import { Link } from "react-router-dom";

interface GuideCardProps {
  guide: Guide;
}

const GuideCard = ({ guide }: GuideCardProps) => {
  return (
    <Link
      to={`/guide/${guide.id}`}
      className="group block rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-4">
        <img
          src={guide.avatar}
          alt={guide.name}
          className="h-14 w-14 shrink-0 rounded-full bg-accent"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-semibold text-foreground group-hover:text-primary transition-colors">
              {guide.name}
            </h3>
            {!guide.available && (
              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                Unavailable
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {guide.location}
            </span>
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {guide.languages.slice(0, 2).join(", ")}
              {guide.languages.length > 2 && ` +${guide.languages.length - 2}`}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {guide.specialties.slice(0, 3).map((s) => (
              <span key={s} className="rounded-md bg-accent px-2 py-0.5 text-xs text-accent-foreground">
                {s}
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="text-sm font-medium">{guide.rating}</span>
              <span className="text-xs text-muted-foreground">({guide.reviewCount})</span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              ₹{guide.pricePerDay.toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/day</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GuideCard;
