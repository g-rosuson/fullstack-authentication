import styling from './Spinner.module.scss';

const Spinner = () => {
    return (
        <div
            className={styling.spinner}
            role="progressbar"
            aria-busy="true"
            aria-label="Loading resources..."
        >
            Loading resources...
        </div>
    );
};

export default Spinner;