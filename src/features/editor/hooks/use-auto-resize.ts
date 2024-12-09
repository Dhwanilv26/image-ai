/* eslint-disable @typescript-eslint/ban-ts-comment */
import { fabric } from "fabric";
import { useCallback, useEffect } from "react";

interface UseAutoResizeProps {
  canvas: fabric.Canvas | null;
  container: HTMLDivElement | null;
}

export const useAutoResize = ({ canvas, container }: UseAutoResizeProps) => {
  const autoZoom = useCallback(() => {
    if (!canvas || !container) return;

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    canvas.setWidth(width);
    canvas.setHeight(height);

    const center = canvas.getCenter();

    const zoomRatio = 0.85;
    const localWorkspace = canvas
      .getObjects()
      .find((object) => object.name === "clip");

    // @ts-ignore
    const scale = fabric.util.findScaleToFit(localWorkspace, {
      width: width,
      height: height,
    });
    // finds the scale that how much the content has to be resized accordingly


    const zoom = zoomRatio * scale;
    // multiplying zoomratio so that some space is left also

    canvas.setViewportTransform(fabric.iMatrix.concat());
    // reseting the previous effects and the view port of it accordingly (reset to initial state)


    canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoom);
    // allows zooming from a specific point

    if (!localWorkspace) return;
    // now centering the localworkspace too to ensure that it remains centered on the canvas
    const workspaceCenter = localWorkspace.getCenterPoint();
    const viewportTransform = canvas.viewportTransform;

    if (
      canvas.width === undefined ||
      canvas.height === undefined ||
      !viewportTransform
    ) {
      return;
    }

    viewportTransform[4] = canvas.width / 2 - workspaceCenter.x * viewportTransform[0];

    viewportTransform[5] = canvas.height / 2 - workspaceCenter.y * viewportTransform[3];

    /*
    workspaceCenter.y * viewportTransform[3] calculates how far the center of the workspace has moved vertically, based on the zoom factor.
    viewportTransform[3] is the zoom factor on the Y-axis (scaling factor for the height).
    */

    canvas.setViewportTransform(viewportTransform);

    localWorkspace.clone((cloned: fabric.Rect) => {
      canvas.clipPath = cloned;
      canvas.requestRenderAll();
    });
  }, [canvas, container]);

  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;

    if (canvas && container) {
      resizeObserver = new ResizeObserver(() => {
        autoZoom();
      });

      resizeObserver.observe(container);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [canvas, container, autoZoom]);

  return { autoZoom };
};