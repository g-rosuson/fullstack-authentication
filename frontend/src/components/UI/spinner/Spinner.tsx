import styling from './Spinner.module.scss';

const Spinner = () => {
    return (
        <div
            className={styling.spinner}
            role="progressbar"
            aria-busy="true"
            aria-label="Loading"
            data-testid="spinner"
        >
            <span className={styling.dot}/>
            <span className={styling.dot}/>
            <span className={styling.dot}/>
        </div>
    );
};

export default Spinner;