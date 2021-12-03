export const AddImageToAnnouncementRequest = {
  schema: {
    type: 'object',
    required: ['image'],
    properties: {
      image: {
        type: 'string',
        format: 'binary',
      },
    },
  },
};
