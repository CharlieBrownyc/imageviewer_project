INSERT INTO image (
        id,
        filename,
        "originalName",
        "mimeType",
        path,
        size,
        "uploadedAt"
    )
VALUES (
        uuid_generate_v4(),
        'file-abc.jpg',
        'abc.jpg',
        'image/jpeg',
        '/uploads/file-abc.jpg',
        93440,
        NOW()
    );
DELETE FROM image
WHERE id = 'acce33f4-d27f-41fb-9d70-7d405f70320b';