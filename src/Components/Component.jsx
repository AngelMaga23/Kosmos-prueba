import React, { useRef } from 'react'
import Moveable from "react-moveable";
export const Component = ({
    updateMoveable,
    top,
    left,
    width,
    height,
    index,
    color,
    image,
    id,
    setSelected,
    isSelected = false,
    onDelete,
    updateEnd,
    parentRef,
  }) => {
    const ref = useRef();

    let parent = document.getElementById("parent");
    let parentBounds = parent?.getBoundingClientRect();
  
    const onResize = async (e) => {
      const { width, height, direction } = e;
  
      const newWidth = Math.max(width, 0);
      const newHeight = Math.max(height, 0);
  
      updateMoveable(id, {
        top,
        left,
        width: newWidth,
        height: newHeight,
        color,
        image,
      });
  
      ref.current.style.width = `${newWidth}px`;
      ref.current.style.height = `${newHeight}px`;
    };
  
    const onResizeEnd = async (e) => {
      const { width, height, lastEvent } = e;
  
      const newWidth = Math.max(width, 0);
      const newHeight = Math.max(height, 0);
      const { translate } = lastEvent;
  
      const newLeft = left + translate[0];
      const newTop = top + translate[1];
  
      updateMoveable(
        id,
        {
          top: newTop,
          left: newLeft,
          width: newWidth,
          height: newHeight,
          color,
          image,
        },
        true
      );
    };
  
    const getParentBounds = () => {
      const parentElement = parentRef.current;
      if (parentElement) {
        const parentRect = parentElement.getBoundingClientRect();
        return {
          left: parentRect.left,
          top: parentRect.top,
          right: parentRect.right,
          bottom: parentRect.bottom,
        };
      }
      return null;
    };
  
    const onDrag = (e) => {
      const { top, left } = e;
  
      // Obtener los límites del elemento "parent"
      const parentBounds = getParentBounds();
  
      if (parentBounds) {
        // Calcular los límites del componente
        const componentBounds = ref.current.getBoundingClientRect();
        const componentRight = left + componentBounds.width;
        const componentBottom = top + componentBounds.height;
  
        // Verificar si el componente se sale de los límites del contenedor
        if (left < parentBounds.left) {
          e.left = parentBounds.left; // Restringir al límite izquierdo
        }
        if (top < parentBounds.top) {
          e.top = parentBounds.top; // Restringir al límite superior
        }
        if (componentRight > parentBounds.right) {
          e.left = parentBounds.right - componentBounds.width; // Restringir al límite derecho
        }
        if (componentBottom > parentBounds.bottom) {
          e.top = parentBounds.bottom - componentBounds.height; // Restringir al límite inferior
        }
  
        // Actualizar las coordenadas del componente
        updateMoveable(id, {
          top: e.top,
          left: e.left,
          width,
          height,
          color,
          image,
        });
      }
    };
  
    return (
      <>
        <div
          ref={ref}
          className="draggable"
          id={"component-" + id}
          style={{
            position: "absolute",
            top: top,
            left: left,
            width: width,
            height: height,
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
          }}
          onClick={() => setSelected(id)}
          onDoubleClick={onDelete}
        />
        <Moveable
          target={isSelected && ref.current}
          resizable
          draggable
          onDrag={onDrag}
          onResize={onResize}
          onResizeEnd={onResizeEnd}
          keepRatio={false}
          throttleResize={1}
          snapDragArea={{
            left: [0, parentBounds?.width],
            top: [0, parentBounds?.height],
          }}
          renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
          edge={false}
          zoom={1}
          origin={false}
          padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
          guidelines={true} 
        />
      </>
    );
}
