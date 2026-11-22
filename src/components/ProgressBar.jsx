export default function ProgressBar({
  currentStep,
  totalSteps,
  stepTitles,
}) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div>
      <h3>{stepTitles[currentStep - 1]}</h3>

      <p>
        Step {currentStep} of {totalSteps} ({progress}%)
      </p>

      <div
        style={{
          width: "100%",
          height: "10px",
          backgroundColor: "#ddd",
          borderRadius: "5px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: "#4CAF50",
          }}
        />
      </div>
    </div>
  );
}