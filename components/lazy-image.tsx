import Image, { type ImageProps } from "next/image";

type LazyImageProps = Omit<ImageProps, "loading" | "decoding" | "fetchPriority"> & {
  priority?: boolean;
};

export function LazyImage({
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  ...props
}: LazyImageProps) {
  return (
    <Image
      {...props}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "low"}
      sizes={sizes}
    />
  );
}
