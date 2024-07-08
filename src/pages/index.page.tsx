import { Button } from "@/components";
import { Flash } from "@/modules";
import { CustomerForm, ItemForm } from "@/modules/cycleFlow";
import { useFlow } from "@/modules/cycleFlow/useFlow";
import { DumbVideoStream } from "@/modules/videoStream";
import {
  VideoStreamContainer,
  VideoStreamContainerItem,
} from "@/modules/videoStream/VideoStreamContainer";

const delay = async (x: number) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), x);
  });
};

const Parent = () => {
  const {
    itemFormValues,
    setItemFormValues,
    giverFormValues,
    setGiverFormValues,
    status,
    setStatus,
    imageDataUrl,
    setImageDataUrl,
    flashSignal,
    captureSignal,
    capture,
  } = useFlow();

  return (
    <main
      className={`min-h-screen`}
      onClick={() => {
        if (status !== "capturing") return;
        capture();
        setStatus("selecting");
      }}
    >
      <br />
      {status === "item_form" && (
        <div>
          <div>
            <ItemForm
              onFormSuccess={(x) => {
                setItemFormValues(x);
                setStatus("giver_form");
              }}
              onFormFail={() => {
                console.log("fail");
              }}
            />
          </div>
        </div>
      )}
      {status === "giver_form" && (
        <div>
          <div>
            <CustomerForm
              onFormSuccess={(x) => {
                setGiverFormValues(x);
                setStatus("capturing");
              }}
              onFormFail={() => {
                console.log("fail");
              }}
            />
          </div>
        </div>
      )}
      <div className="prose w-full m-auto">
        <h2 className="text-center">
          {status === "capturing" && "Tap anywhere to take photo"}
          {status === "selecting" && "Select photo or discard"}
          {status === "sending" && "Please wait..."}
          {status === "fail" && "Something has gone wrong, please try again"}
          {status === "success" && "Success! Please return the device"}
        </h2>
      </div>
      <br />

      <div className="flex justify-center items-center">
        <VideoStreamContainer>
          {(status === "capturing" || status === "selecting") && (
            <VideoStreamContainerItem>
              <Flash signal={flashSignal} />
            </VideoStreamContainerItem>
          )}
          {(status === "capturing" || status === "selecting") && (
            <VideoStreamContainerItem>
              <DumbVideoStream
                signal={captureSignal}
                onCapture={(x) => setImageDataUrl(x)}
                className={`${status === "selecting" ? "invisible" : ""}`}
              />
            </VideoStreamContainerItem>
          )}
          {(status === "selecting" ||
            status === "sending" ||
            status === "success") && (
            <VideoStreamContainerItem>
              <div
                className={`flex w-full h-full`}
                style={{
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundImage: `url('${imageDataUrl}`,
                }}
              />
            </VideoStreamContainerItem>
          )}
          {status === "sending" && (
            <VideoStreamContainerItem>
              <div
                className={`flex w-full h-full justify-center items-center bg-gray-400 opacity-60`}
              >
                <span className="loading loading-spinner loading-lg" />
              </div>
            </VideoStreamContainerItem>
          )}
          {status === "fail" && (
            <VideoStreamContainerItem>
              <div className="flex justify-center w-full h-full items-center">
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant="error"
                    onClick={() => setStatus("selecting")}
                  >
                    Try again
                  </Button>
                </div>
              </div>
            </VideoStreamContainerItem>
          )}
        </VideoStreamContainer>
      </div>
      <br />
      {status === "selecting" && (
        <div className="flex justify-center gap-2">
          <Button
            variant="primary"
            onClick={async () => {
              setStatus("sending");
              await delay(1000);
              setStatus(Math.random() > 0.8 ? "success" : "fail");
            }}
          >
            Select
          </Button>
          <Button
            variant="ghost"
            outline
            onClick={() => {
              setImageDataUrl(undefined);
              setStatus("capturing");
            }}
          >
            Discard
          </Button>
        </div>
      )}
      {status === "success" && (
        <div className="flex flex-col justify-center items-center">
          <div>
            <pre>
              {JSON.stringify(
                { itemFormValues, giverFormValues },
                undefined,
                2
              )}
            </pre>
          </div>
          <div>
            <Button
              variant="ghost"
              outline
              onClick={async () => setStatus("capturing")}
            >
              Start again
            </Button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Parent;
