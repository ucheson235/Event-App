import html2canvas from "html2canvas";

export const downloadTicket = async (element, fileName = "techember-fest-ticket") => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: null,
      logging: false,
    });

    const blob = await new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        "image/png",
        1.0
      );
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName.replace(/\s+/g, "_")}.png`;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error("Download failed:", error);
    throw new Error("Failed to generate ticket download");
  }
};