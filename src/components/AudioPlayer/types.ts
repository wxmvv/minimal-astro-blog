export interface Track {
  readonly title: string;
  readonly tags: readonly string[];
  /** Resolved audio URL; an empty string marks an unavailable track. */
  readonly src: string;
}
