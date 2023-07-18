
import { useContext, useState, memo } from "react";
import { SpeakerFilterContext } from "../contexts/SpeakerFilterContext";
import { SpeakerProvider, SpeakerContext } from "../contexts/SpeakerContext";
import SpeakerDelete from "./SpeakerDelete";
import ErrorBoundary from "./ErrorBoundary";

// use ErrorBoundary so prod will render all other working components even if this component errors out
function Speaker(props) {
    return (
        <ErrorBoundary errorUI={<SpeakerNoErrorBoundary {...props} showErrorCard={true}></SpeakerNoErrorBoundary>}>
            <SpeakerNoErrorBoundary {...props}></SpeakerNoErrorBoundary>
        </ErrorBoundary>
    )
}

// use memo(function, booleanFunction) to rerender only when booleanFunction is false
// use showErrorCard prop to return an error card at the error boundary
const SpeakerNoErrorBoundary = memo(function Speaker({ speaker, updateRecord, insertRecord, deleteRecord, showErrorCard, }) {
    const { showSessions } = useContext(SpeakerFilterContext);

    if (showErrorCard) {
        return (
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-sm-12 col-xs-12">
                <div className="card card-height p-4 mt-4">
                    <img src="/images/speaker-99999.jpg" />
                    <div><b>Error Showing Speaker</b></div>
                </div>
            </div>
        )
    }

    return (
        <SpeakerProvider speaker={speaker} updateRecord={updateRecord}
            insertRecord={insertRecord} deleteRecord={deleteRecord}>
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-sm-12 col-xs-12">
                <div className="card card-height p-4 mt-4">
                    <SpeakerImage />
                    <SpeakerDemographics />
                </div>
                {showSessions === true ? <Sessions /> : null}
                <SpeakerDelete />
            </div>
        </SpeakerProvider>
    )
}, areEqualSpeaker);

function areEqualSpeaker(prevProps, nextProps) {
    return (prevProps.speaker.favorite === nextProps.speaker.favorite);
}

function ImageWithFallback({ src, ...props }) {
    const [error, setError] = useState(false);
    const [imgSrc, setImgSrc] = useState(src);

    function onError() {
        if (!error) {
            console.log("I'm errored");
            setImgSrc("/images/speaker-99999.jpg");
            setError(true);
        }
    }

    return <img src={imgSrc} {...props} onError={onError} />
}

function SpeakerImage() {
    const { speaker: { id, first, last } } = useContext(SpeakerContext);

    return (
        <div className="speaker-img">
            <ImageWithFallback className="contain-fit" src={`/images/speaker-${id}.jpg`} width="300" alt={`${first} ${last}`} />
        </div>
    )
}

function SpeakerDemographics() {
    const { speaker } = useContext(SpeakerContext);
    const { first, last, bio, company, twitterHandle } = speaker;
    return (
        <div className="speaker-info">
            <div className="d-flex justify-content-between mb-3">
                <h3 className="test-truncate w-200">
                    {first} {last}
                </h3>
            </div>
            <SpeakerFavorite />
            <div>
                <p>{bio.substr(0, 70)}</p>
                <div className="social d-flex flex-row mt-4">
                    <div className="company">
                        <h5>Company</h5>
                        <h6>{company}</h6>
                    </div>
                    <div className="twitter">
                        <h5>Twitter</h5>
                        <h6>{twitterHandle}</h6>
                    </div>
                </div>
            </div>
        </div>
    )
}

function SpeakerFavorite({ favorite, onFavoriteToggle }) {
    const { speaker, updateRecord } = useContext(SpeakerContext);
    const [inTransition, setInTransition] = useState(false);

    function doneCallback() {
        setInTransition(false);
        console.log(`In SpeakerFavorite:doneCallback ${new Date().getMilliseconds()}`);
    }

    let showTransition;
    if (inTransition) {
        showTransition = <span className="fas fa-circle-notch fa-spin"></span>
    }

    return (
        <div className="action padB1">
            <span onClick={function () {
                setInTransition(true);
                updateRecord(
                    {
                        ...speaker, favorite: !speaker.favorite,
                    },
                    doneCallback
                )
            }}>
                <i className={speaker.favorite === true ? "fa fa-star orange" : "fa fa-star-o orange"} />{" "}Favorite{" "}
                {showTransition}
            </span>
        </div>
    )
}

function Sessions() {
    const { eventYear } = useContext(SpeakerFilterContext);
    const { speaker } = useContext(SpeakerContext);
    const sessions = speaker.sessions;
    return (
        <div className="sessionBox card h-250">
            {sessions.filter((session) => session.eventYear === eventYear)
                .map(session => <Session key={session.id} title={session.title} room={session.room.name} {...sessions} />)}
        </div>
    )
}

function Session({ title, room }) {
    // if not deconstructed in the argument above would use
    // const {title, room} = props;
    return (
        <span className="session w-100">
            {title} <strong>Room: {room}</strong>
        </span>
    )
}

export default Speaker;