export class SchemaUtil {
  static get options() {
    return {
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
      versionKey: false,
      toObject: {
        transform: (_, ret) => {
          ret.id = ret._id;
          delete ret._id;
          return ret;
        },
      },
    };
  }
}
