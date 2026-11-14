function AvailabilityBadge({isAvailable}) {
    const status = isAvailable
        ? "Доступна"
        : "Нет в наличии";

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