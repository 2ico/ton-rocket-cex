import { useTranslation, Trans } from 'react-i18next';

export default function NotFound() {
    const { t } = useTranslation();
    return (
        <div>{t("page_x_not_found", {pathname: window.location.pathname})}</div>
    );
}