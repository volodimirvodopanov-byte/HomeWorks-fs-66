
function AvailabilityBadge ({isAvailable}) {
 const status = isAvailable
        ? "Доступен"
        : "Набор закрыт";

 const badgeClass = isAvailable
    ? "availability-badge badge-open"
    : "availability-badge badge-closed";

    return (
        <span className={badgeClass}>

            {status}

        </span>


    );

}

export default AvailabilityBadge