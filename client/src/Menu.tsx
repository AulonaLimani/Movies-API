import Authorized from "./auth/Authorized";

export default function Menu() {
    return (
        <nav className={'navbar navbar-expand-lg navbar-light bg-light'}>
            <div className={"container-fluid"}>
                <a className={"navbar-brand"} href="/">Home</a>
                <div className={"collapse navbar-collapse"}>
                    <ul className={"navbar-nav me-auto mb-2 mb-lg-0"}>
                        <li className={"nav-item"}>
                            <a className={"nav-link"} href="/movies/filter">
                                Filter Movies
                            </a>
                        </li>

                        <Authorized
                            role={'admin'}
                            authorized={<>
                                <li className={"nav-item"}>
                                    <a className={"nav-link"} href="/genres">
                                        Genres
                                    </a>
                                </li>
                                <li className={"nav-item"}>
                                    <a className={"nav-link"} href="/actors">
                                        Actors
                                    </a>
                                </li>
                                <li className={"nav-item"}>
                                    <a className={"nav-link"} href="/movietheaters">
                                        Movie Theaters
                                    </a>
                                </li>
                                <li className={"nav-item"}>
                                    <a className={"nav-link"} href="/movies/create">
                                        Create Movie
                                    </a>
                                </li>
                            </>}
                        />
                    </ul>
                </div>
            </div>
        </nav>
    );
}