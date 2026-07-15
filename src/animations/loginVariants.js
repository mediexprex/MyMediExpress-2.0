export const backgroundVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },

  visible: {
    opacity: 1,
    scale: 1,

    transition: {
      duration: 1.2,
      ease: "easeOut",
    },
  },
};

export const logoVariants = {
  hidden: {
    opacity: 0,
    y: -80,
    scale: 0.5,
    rotate: -15,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,

    transition: {
      duration: 1,
      delay: 0.2,
      ease: "easeOut",
    },
  },
};

export const boxVariants = {
  hidden: {
    opacity: 0,
    x: -350,
    scale: 0.7,
    rotate: -10,
  },

  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    rotate: 0,

    transition: {
      duration: 1.2,
      delay: 0.8,
      ease: "easeInOut",
    },
  },
};

export const cardVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 60,
  },

  visible: {
    opacity: 1,
    scale: 1,
    y: 0,

    transition: {
      duration: 0.8,
      delay: 1.8,
      ease: "easeOut",
    },
  },
};

export const formVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.7,
      delay: 2.2,
      ease: "easeOut",
    },
  },
};