import './FirstList.css';
import logo from '../../images/logo.png'
import useAuthStore from '../../hooks/useAuthStore';
import { API_BASE_URL } from '../../utils/const';

function FirstList({ kpNumber, kpDate, contractNumber, contractDate, kpPreviewSelectors, listSelector }) {
    const {
        logoContainerSelector,
        logoSelector,
        subtitleSelector,
        kpNumberSelector,
        kpNumberTitleSelector,
        managerSelector,
        managerInfosSelector,
        managerPhotoSelector
    } = kpPreviewSelectors

    const { user } = useAuthStore();

    return (
        <section className="first-list">
            <div className={listSelector}>
                <div className={logoContainerSelector}>
                    <img className={logoSelector} src={logo} alt='logo' />
                </div>
                <div className={subtitleSelector}>
                    <div className={kpNumberSelector}>
                        <h1 className={kpNumberTitleSelector}>
                            <p>{`Коммерческое предложение №  ${kpNumber} от  ${kpDate} `}</p>
                            <p>{`к договору №${contractNumber} от ${contractDate}`}</p>
                        </h1>
                    </div>
                    <div className={managerSelector}>
                        <div className={managerInfosSelector}>
                            <p className="manager_info manager_info__name">{user.name}</p>
                            <p className="manager_info manager_info__job-title">{user.job}</p>
                            <p className="manager_info manager_info__email">{user.email}</p>
                            <p className="manager_info manager_info__tel">{user.tel}</p>
                        </div>
                        <img className={managerPhotoSelector} src={`${API_BASE_URL}/static/${user.photo}`} alt="manager" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FirstList;